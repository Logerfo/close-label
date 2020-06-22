[![Build Status](https://travis-ci.org/Logerfo/close-label.svg?branch=master)](https://travis-ci.org/Logerfo/close-label)
[![Dependencies Status](https://david-dm.org/logerfo/close-label/dev-status.svg)](https://david-dm.org/logerfo/close-label?type=dev)

# close-label

> A GitHub App built with [Probot](https://github.com/probot/probot) that applies a specific label to an issue closed through a pull request in the same repository considering its current labels.

## Setup for using the bot in your repo
Create a file named `.github/close-label.yml` and fill it with whatever you like. Example:
```yml
bug: fixed
enhancement: implemented
feature: implemented
```
If a pull request gets merged and it has "fixes #42" in its body, if issue #42 has the label `feature`, the label `implemented` will be applied to it.

## Using the bot as a GitHub app
Install the app through the GitHub [Marketplace](https://github.com/marketplace/close-label).

## Using the bot as a GitHub Action
```yml
name: Close-label
on:
- pull_request

jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
    - uses: logerfo/close-label@0.0.4
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}
```

## It will work for
- Every [documented](https://help.github.com/en/articles/closing-issues-using-keywords) keyword.
- Multiple index labels: if the issue has both `bug` and `feature` label, it will get labeled as both `fixed` and `implemented`.

## It will not work for
- Retroactively, as design.
- Multiple target labels. Example: `bug: ["fixed", "done"]`. This should be easy to do and it's up for grabs, feel free to submit a pull request making this happen.
- Cross-repo references. I think it might be possible to develop if both repos have the app installed, but I'm not sure.

## Setup for running the bot

```sh
# Install dependencies
npm install

# Run typescript
npm run build

# Run the bot
npm start
```

## Changelog
Click [here](CHANGELOG.md).

## Contributing

If you have suggestions for how close-label could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## Donate

<img src="https://i.imgur.com/ndlBtuX.png" width="200">

BTC: 1LoGErFoNzE1gCA5fzk6A82nV6iJdKssSZ

## License

[ISC](LICENSE) © 2019 Bruno Logerfo <bruno@logerfo.tk> (https://github.com/Logerfo/close-label)

## Icon
The [application icon](icon.png) is a modified version of a icon by [Cole Bemis](https://www.iconfinder.com/icons/3324935/branch_git_icon) under the [Creative Commons 3.0](https://creativecommons.org/licenses/by/3.0/) License.
