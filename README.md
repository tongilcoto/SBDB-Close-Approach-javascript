# TESTING FROM A DOCKER CONTAINER

## DOCKER PRE-REQUISITES


Before we start building images, ensure you have enabled BuildKit on your machine. BuildKit is enabled by default for all users on Docker Desktop. If you have installed Docker Desktop, you don’t have to manually enable BuildKit. If you are running Docker on Linux, you can enable BuildKit either by using an environment variable or by making BuildKit the default setting.

To set the BuildKit environment variable when running the docker build command, run:

```
$ DOCKER_BUILDKIT=1 docker build .
```


To enable docker BuildKit by default, set daemon configuration in `/etc/docker/daemon.json` feature to `true` and restart the daemon. If the `daemon.json` file doesn’t exist, create new file called `daemon.json` and then add the following to the file.

```
{
  "features":{"buildkit" : true}
}
```

Docker Versions:
- Engine: 20.10.17
- Compose: v2.10.2


## AUTOMATED TESING FRAMEWORK

- Language: Javascript/Node.js
- Test definitions: BDD (Gherkin)
- BDD Framework: Cucumber JS
- File Structure

```
    /
        | - /features
        | - /tests
                | - steps .js files
                | - hooks.js
                | - setup.js
                | - /src
                        | - .js files
                        | - constants.js
        | - package.json
        | - package-lock.json
        | - .dockerignore
        | - Dockerfile
        | - compose.yaml
        | - run_framework.sh
```

    - features: folder where to allocate features files, the ones that Cucumber JS will use. (I recommend to use a test management tool as repository, instead of a regular code (files) repository. I recommend to use Xray for Jira as test management tool for dealing with BDD automation testing frameworks)
    - steps .js files: the glue between the feature text files and the javascript code. They host the steps implementation. Each step implementation should be short in code lines by offloading functionality to other functions than can be reused by other steps too
    - hooks.js: Before and After features of Cucumber JS
    - src: automation framework implementation
    - rest of files at root folder: node and docker stuff


- Acceptance Test Plan approach

    This test plan is using a business approach. 
    - Each test should
        - test a meaningful business combination of query parameters
        - use a variety of values for input data
        - validate the response schema (response records fields depend on the query parameter list)
        - validate the data records are following query parameters constraints
    - Each
        - query parameter should appear in at lest one test of the test plan
        - reponse record fields combination should be validated in at least one test of the test plan
    - Out of Scope because it is an acceptance test plan
        - single query parameter requests 
        - exhaustive input values coverage



## API CONFIGURATION

- Api Version: Constant in `constants.js` file


## HOW TO

### Run the framework

```
./run_framework.sh
```

It: 
- Forces docker image building with current files in the directory
- Raises up the docker container
- Runs the tests (all features in the `features` folder)
- Deletes the docker container. The docker image is not deleted


### Access result report

- `reports/cucumber.html`:

Cucumber framework's HTML official report 

- `reports/cucumber.json`:

Cucumber framework's JSON official report. It can be uploaded to some test management tools, as Xray (Jira plugin), in order to be analysed.



HINTS:

- .vscode/launch.json

'''
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "All features",
            "program": "${workspaceFolder}/node_modules/.bin/cucumber-js",
            "args": ["--require", "tests", "--publish-quiet"]
        }
    ]
}
'''


