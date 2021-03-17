import Application from "dummy/app";
import config from "dummy/config/environment";
import { setApplication } from "@ember/test-helpers";
import { start } from "ember-qunit";
import QUnit from "qunit";

import "qunit-dom";

setApplication(Application.create(config.APP));
QUnit.config.testTimeout = 1000;
start();
