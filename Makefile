BIN=node_modules/.bin

test:
	$(BIN)/mocha test/specs/

lint:
	$(BIN)/eslint bin/doxdox
	$(BIN)/eslint lib/
	$(BIN)/eslint index.js

coverage:
	$(BIN)/istanbul cover $(BIN)/_mocha test/specs && $(BIN)/codecov

docs:
	doxdox lib/ -p package.json -l Markdown -o DOCUMENTATION.md

.PHONY: test coverage
