import Application from "test-app/app";
import config from "test-app/config/environment";
import { setApplication } from "@ember/test-helpers";
import { start } from "ember-qunit";
import QUnit from "qunit";
import { setup } from "qunit-dom";
import "qunit-dom";

setup(QUnit.assert);
setApplication(Application.create(config.APP));
QUnit.config.testTimeout = 1000;
start();
