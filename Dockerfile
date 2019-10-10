FROM node:10

LABEL "com.github.actions.name"="close-label"
LABEL "com.github.actions.description"="A Probot app that applies a specific label to an issue closed through a pull request considering its current labels."
LABEL "com.github.actions.icon"="git-pull-request"
LABEL "com.github.actions.color"="red"

LABEL "repository"="https://github.com/Logerfo/close-label"
LABEL "homepage"="https://github.com/Logerfo"
LABEL "maintainer"="bruno@logerfo.tk"

ENV PATH=$PATH:/app/node_modules/.bin
WORKDIR /app
COPY . .
RUN npm install --production && npm run build

ENTRYPOINT ["probot", "receive"]
CMD ["/app/lib/index.js"]
