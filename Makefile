.DEFAULT_GOAL := help

NPM_BINARY_PREFIX := ./node_modules/.bin

# Porcelain
# ###############
.PHONY: env-up env-down env-recreate ci build lint test

ci: setup lint test build ## run all tests and build all artifacts
	@echo "Not implemented"; false

env-up: ## set up dev environment
	docker-compose up -d

env-down: ## tear down dev environment
	docker-compose down

env-recreate: env-down env-up ## deconstruct current env and create another one

build: setup ## create artifact
	@echo "Not implemented"; false

lint: ## run static analysis
	@echo "Not implemented"; false

test: setup env-up ## run all tests
	$(NPM_BINARY_PREFIX)/jest --detectOpenHandles


# Scripts
# ###############
psql: ## connect to Postgres
	psql -h localhost -U $$PGUSER

# Plumbing
# ###############
.PHONY: setup

setup: node_modules	

node_modules: package.json yarn.lock
	yarn install --frozen-lockfile
	touch node_modules


# Utilities
# ###############
.PHONY: help
help: ## print this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
