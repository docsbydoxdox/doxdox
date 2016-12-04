BIN=node_modules/.bin

test:
	make lint
	$(BIN)/mocha test/specs
	doxdox 'lib/**/*.js' --layout markdown | diff DOCUMENTATION.md -

lint:
	$(BIN)/eslint bin/doxdox
	$(BIN)/eslint lib
	$(BIN)/eslint index.js
	$(BIN)/eslint 'test/specs/**/*.js'

coverage:
	$(BIN)/istanbul cover $(BIN)/_mocha test/specs && $(BIN)/codecov

fixtures:
	bin/doxdox lib/doxdox.js --output test/fixtures/doxdox.md --package lib

docs:
	bin/doxdox 'lib/**/*.js' -p package.json -l markdown -o DOCUMENTATION.md

.PHONY: test coverage
