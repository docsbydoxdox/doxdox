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
	bin/doxdox 'lib/**/*.js' -p package.json -l markdown -o DOCUMENTATION.md

.PHONY: test coverage
