import "mocha";
import { expect } from "chai";
import App, { AppExceptions } from "./App";

describe("App", function () {
    let app: App;

    beforeEach(function () {
        app = new App();
    });

    describe("#set", function () {
        it("does not overwrite a service", function () {
            app.set<boolean>("service.x", (): boolean => true);
            expect(() => (app.set<number>("service.x", (): number => 5)))
                .throws(AppExceptions.setAlreadyExists("service.x"));
        });

        it("sets multiple services", function () {
            app.set<boolean>("service.x", (): boolean => true);
            app.set<number>("service.y", (): number => 5);
            expect(app.make<boolean>("service.x")).eq(true);
            expect(app.make<number>("service.y")).eq(5);
        });
    });

    describe("#make", function () {
        it("can make a service", function () {
            let called = false;
            app.set<boolean>("service-x", (): boolean => {
                called = true;
                return true;
            });

            expect(called).eq(false);
            expect(app.make<boolean>("service-x")).eq(true);
            expect(called).eq(true);
        });

        it("makes multiple instances of a services", function () {
            let callcount = 0;
            app.set<boolean>("service.x", (app: App): boolean => {
                callcount++;
                return true;
            });
            expect(app.make<boolean>("service.x")).eq(true);
            expect(callcount).eq(1);
            expect(app.make<boolean>("service.x")).eq(true);
            expect(callcount).eq(2);
        });

        it("throws an exception when trying to make a non-existant service", function () {
            expect((): boolean => app.make<boolean>("service.x"))
                .throws(AppExceptions.makeDoesNotExist("service.x"));
        });
    });

    describe("#single", function () {
        it("gets a single instance of a service", function () {
            let callcount = 0;
            app.set<boolean>("service.x", (app: App): boolean => {
                callcount++;
                return true;
            });
            expect(app.single<boolean>("service.x")).eq(true);
            expect(callcount).eq(1);
            expect(app.single<boolean>("service.x")).eq(true);
            expect(callcount).eq(1);
        });

        it("throws an exception when trying to get a singleton of a non-existant service", function () {
            expect((): boolean => app.single<boolean>("service.x"))
                .throws(AppExceptions.makeDoesNotExist("service.x"));
        });
    });

    describe("#overwrite", function () {
        it("overwrites an existing service", function () {
            app.set<boolean>("service.x", (): boolean => true);
            app.overwrite<number>("service.x", (): number => 5);
            expect(app.make<number>("service.x")).eq(5);
        });
        it("throws an exception when trying to overwrit a non-existant service", function () {
            expect(() => app.overwrite<number>("service.x", (): number => 5))
                .throws(AppExceptions.overwriteNotExist("service.x"));
        });
    });
});
