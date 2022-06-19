#! /usr/bin/env bash

sed -i "s|GITHUB_TOKEN_VALUE|$$GITHUB_TOKEN_VALUE|g" app.yaml
sed -i "s|JIRA_USER_VALUE|$$JIRA_USER_VALUE|g" app.yaml
sed -i "s|JIRA_PASSWORD_VALUE|$$JIRA_PASSWORD_VALUE|g" app.yaml

