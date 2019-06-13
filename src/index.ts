import { Application/*, Context*/ } from 'probot'
const yaml = require('js-yaml')

const re = /(?:(?:resolv|clos)e[ds]?|fix(?:e[ds])?) +#(\d+)/ig

//couldn't get this to work, i think `getLabel` is creating the label if it doesn't exist
/*
async function ensureLabelExists(context: Context, name: string) {
    try {
        return await context.github.issues.getLabel(context.repo({
            name: name,
        }))
    } catch (e) {
        return context.github.issues.createLabel(context.repo({
            name: name,
            color: '69D100'
        }))
    }
}
*/
export = (app: Application) => {
    app.on('pull_request.closed', async (context) => {
        const pull = context.payload.pull_request
        if (!pull.merged) {
            app.log('Pull request is closed, but not merged. Stepping out...')
            return
        }
        const repo = await context.github.repos.get(context.repo())
        if (repo.data.default_branch != pull.base.ref) {
            app.log(`The pull request base branch (${pull.base.ref}) is not the repo default branch (${repo.data.default_branch}). Stepping out...`)
            return
        }
        const issues = new Set<string>()
        let match = re.exec(pull.body)
        while (match) {
            issues.add(match[1])
            app.log(`Found fixed issue: #${match[1]}.`)
            match = re.exec(pull.body)
        }
        if (issues.size == 0) {
            app.log('This pull request fixes no issue. Stepping out...')
            return
        }
        const content = await context.github.repos.getContents(context.repo({
            path: '.github/close-label.yml',
        }))
        const config = yaml.safeLoad(Buffer.from(content.data.content, 'base64').toString())
        issues.forEach(async id => {
            const issue = await context.github.issues.get(context.issue({
                number: id,
            }))
            const currentLabels = issue.data.labels.map(label => label.name)
            const labels = new Set<string>()
            currentLabels.forEach(label => {
                if (labels.has(label)) {
                    labels.delete(label)
                    app.log(`Issue #${id} already have label ${label}. Skipping...`)
                }
                else {
                    const labelToAdd = config[label]
                    if (labelToAdd) {
                        labels.add(labelToAdd)
                        app.log(`Label ${label} is going to be added to issue #${id}.`)
                    }
                }
            })
            if (labels.size == 0) {
                app.log(`No label to be added to issue #${id}. Skipping...`)
                return
            }
            const labelsToAdd = Array.from(labels)
            /*
            labelsToAdd.forEach(async label => {
                await ensureLabelExists(context, label)
            })
            */
            app.log(`Adding ${labels.size} labels to issue #${id}...`)
            const addedLabels = await context.github.issues.addLabels(context.issue({
                labels: labelsToAdd,
                number: id,
            }))
            app.log(`${addedLabels.data.length} labels successfully added to issue #${id}.`)
        })
    })
}
