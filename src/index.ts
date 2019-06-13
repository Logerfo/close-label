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
            return
        }
        const issues = new Set<string>()
        let match = re.exec(pull.body)
        while (match) {
            issues.add(match[1])
            match = re.exec(pull.body)
        }
        if (issues.size == 0) {
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
                }
                else {
                    const labelToAdd = config[label]
                    if (labelToAdd) {
                        labels.add(labelToAdd)
                    }
                }
            })
            if (labels.size == 0) {
                return
            }
            const labelsToAdd = Array.from(labels)
            /*
            labelsToAdd.forEach(async label => {
                await ensureLabelExists(context, label)
            })
            */
            await context.github.issues.addLabels(context.issue({
                labels: labelsToAdd,
                number: id,
            }))
        })
    })
}
