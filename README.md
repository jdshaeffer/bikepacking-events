# 🚲 bikepacking-events 🚲

### filtering and sorting for [bikepacking.com/events](https://bikepacking.com/events/)

## stuff for myself:

> (or anyone forking this thing)

- webscraping https://bikepacking.com/events/ with puppeteer from a simple node/express server in my linode box
- `yarn start` for dev (it's just a create react app)
- push to master will trigger a gh action workflow that runs a pre-deploy and the gh-pages build

## other stuff:

> helpful tutorials used to set up some of this stuff w gh pages, kudos to them

- https://dev.to/dyarleniber/setting-up-a-ci-cd-workflow-on-github-actions-for-a-react-app-with-github-pages-and-codecov-4hnp
- https://github.com/gitname/react-gh-pages

> troubleshooting puppeteer in remote linux server

- https://stackoverflow.com/questions/58134793/error-while-loading-shared-libraries-libnss3-so-while-running-gtlab-ci-job-to
- https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
