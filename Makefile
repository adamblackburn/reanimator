PWD = $(shell pwd)
TEST_REPORTER ?= dot
SERVER_PORT ?= 8080
DRIVER_PORT ?= 23251
TEST_TIMEOUT ?= 8000
TEST_SLOW ?= 2000
NODE_MODULES = $(PWD)/node_modules
SERVER_PID_FILE := $(PWD)/$(shell echo ".test-server-pid.$$RANDOM")
PHANTOM_PID_FILE := $(PWD)/$(shell echo ".phantom-pid.$$RANDOM")
JS_FILES = $(shell find lib -path lib/selenium-webdriver -prune -o -name "*.js" -type f) 
JQUERY_VERSION=1.8.3

all: dist/reanimator.js \
	dist/reanimator-jquery.$(JQUERY_VERSION).js \
	demos/tile-game/js/reanimator.js

dist/reanimator.js: $(JS_FILES) app.build.js
	node node_modules/.bin/r.js -o app.build.js

dist/reanimator-jquery.$(JQUERY_VERSION).js: $(JS_FILES) jquery.$(JQUERY_VERSION).build.js
	node node_modules/.bin/r.js -o jquery.$(JQUERY_VERSION).build.js

demos/tile-game/js/reanimator.js: dist/reanimator.js
	rm -f demos/tile-game/js/reanimator.js
	ln -s $(PWD)/dist/reanimator.js demos/tile-game/js/reanimator.js
	rm -f demos/tile-game/js/reanimator-jquery*.js
	ln -s $(PWD)/dist/reanimator-jquery.$(JQUERY_VERSION).js \
			demos/tile-game/js/
	rm -f demos/checkers/js/reanimator.js
	ln -s $(PWD)/dist/reanimator.js demos/checkers/js/reanimator.js
	rm -f demos/checkers/js/reanimator-jquery*.js
	ln -s $(PWD)/dist/reanimator-jquery.$(JQUERY_VERSION).js \
			demos/checkers/js/

fixture-server:
	@cd tests/fixtures
	$(NODE_MODULES)/.bin/http-server -s -p $(SERVER_PORT) & \
		echo "$$!" > $(SERVER_PID_FILE)
	cd $(PWD)

phantom:
	@phantomjs --webdriver=$(DRIVER_PORT) 1>.phantom.out & \
		echo "$$!" > $(PHANTOM_PID_FILE)
	cd $(PWD)

test: dist/reanimator.js dist/reanimator-jquery.$(JQUERY_VERSION).js fixture-server phantom
	mkdir -p tests/fixtures/js/lib
	rm -f tests/fixtures/js/lib/reanimator.js
	rm -f tests/fixtures/js/lib/reanimator-jquery.$(JQUERY_VERSION).js
	rm -f tests/fixtures/js/lib/reanimator
	ln -s $(PWD)/dist/reanimator.js tests/fixtures/js/lib/reanimator.js
	ln -s $(PWD)/dist/reanimator-jquery.$(JQUERY_VERSION).js \
		tests/fixtures/js/lib/reanimator-jquery.$(JQUERY_VERSION).js
	ln -s $(PWD)/lib/reanimator tests/fixtures/js/lib/reanimator
	export DRIVER_PORT=$(DRIVER_PORT)
	export FIXTURE_PORT=$(SERVER_PORT)
	$(NODE_MODULES)/.bin/mocha tests/test --recursive \
		--globals define \
		--timeout $(TEST_TIMEOUT) --slow $(TEST_SLOW) \
		-R $(TEST_REPORTER) $(TEST_ARGS)
	STATUS=$$?
	kill -9 `cat $(SERVER_PID_FILE)` ; rm $(SERVER_PID_FILE)
	kill -9 `cat $(PHANTOM_PID_FILE)` ; rm $(PHANTOM_PID_FILE)
	exit $$STATUS

clean:
	rm -f dist/reanimator.js \
		dist/reanimator-jquery.$(JQUERY_VERSION).js \
		demos/tile-game/js/reanimator.js


.PHONY: test fixture-server
