git_head := $(shell git rev-parse --short HEAD)
package_version := $(shell jq -r .version < package.json)

create_versionfile:
	echo export const ARGUS_FRONTEND_COMMIT = "\"${git_head}\";" > src/version.ts
	echo export const ARGUS_FRONTEND_VERSION = "\"${package_version}\";" >> src/version.ts

build: create_versionfile
	npm run-script build

.PHONY: create_versionfile build
