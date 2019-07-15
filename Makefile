.DEFAULT_GOAL := help

# Porcelain
# ###############
.PHONY: env-up env-down serve ci build lint test container

serve: setup ## run the development server
	@echo "Not implemented"; false

ci: setup lint test build container ## run all tests and build all artifacts
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

test: setup ## run all tests
	@echo "Not implemented"; false

container: ## build container
	@echo "Not implemented"; false


# Plumbing
# ###############
.PHONY: setup

setup:
	@echo "Not implemented"; false


# Utilities
# ###############
.PHONY: help
help: ## print this message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
