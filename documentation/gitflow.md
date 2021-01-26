# Git Flow

The recommended gitflow for this project is as follows:

* Two long-term branches:
  * `main`
  * `dev`
* The `main` branch should always be deployable
* The `dev` branch is used for feature testing and should be deployed to an internal/protected domain
* Features should belong to short-lived feature branches based on `main`
* Feature branches should be merged into the `dev` for user testing
* Feature branches should be merged into the `main` branch for QA/Prod deployment
* Feature branches should be removed once successfully deployed to Prod
* The `dev` should be reset to `main` from time-to-time to keep it clean
* Releases for QA/Prod must be based on the `main` branch, and tagged with 'release-*.*.*' using major-minor-revision notation

## Starting a New Feature

```ssh
$ git checkout main
$ git checkout -b <feature-name>
$ git push --set-upstream origin <feature-name>
```

## Testing a Feature on Dev

```ssh
$ git checkout dev
$ git merge <feature-name> -m <commit-message>
$ git push origin
```

## Creating a New Feature Release

Release tags should use semantic versioning, following the format: 'release-*.*.*' (major.minor.revision).

```ssh
$ git checkout main
$ git merge --squash <feature-name>
$ git commit -m <commit-message>
$ git push origin
$ git tag -a <release-tag> -m <tag-message>
$ git push origin <release-tag>
```

## Removing an Old Feature Branch

```ssh
$ git push -d origin <feature-name>
$ git branch -d <feature-name>
```

## Reset Dev Branch to Main

```ssh
$ git checkout dev
$ git fetch origin
$ git reset --hard main
```
