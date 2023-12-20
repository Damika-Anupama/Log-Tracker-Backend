.PHONY: build-RuntimeDependenciesLayer build-lambda-common
.PHONY: build-getLogsFunction build-postLogsFunction

build-getLogsFunction:
	$(MAKE) HANDLER=src/handlers/get-logs.ts build-lambda-common
build-postLogsFunction:
	$(MAKE) HANDLER=src/handlers/post-logs.ts build-lambda-common

build-lambda-common:
	npm install
	rm -rf dist
	printf "{\"extends\": \"./tsconfig.json\", \"include\": [\"${HANDLER}\"] }" > tsconfig-only-handler.json
	npm run build -- --build tsconfig-only-handler.json
	cp -r dist "$(ARTIFACTS_DIR)/"

build-RuntimeDependenciesLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json"
