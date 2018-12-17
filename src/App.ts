export const AppExceptions = {
    setAlreadyExists: (name) => `Can not set service ${name} - it already exists.`,
    makeDoesNotExist: (name) => `Can not make service ${name} - it does not exist.`,
    overwriteNotExist: (name) => `Can not overwrite service ${name} - it does not exist.`
};

export default class App {
    private services: {} = {};
    private instances: {} = {};

    public set<T> (name: string, service: (app: App) => T) {
        if (this.services.hasOwnProperty(name)) {
            throw Error(AppExceptions.setAlreadyExists(name));
        }
        this.services[name] = service;
    }

    public make<T> (name: string): T {
        if (!this.services.hasOwnProperty(name)) {
            throw Error(AppExceptions.makeDoesNotExist(name));
        }
        return this.services[name](this);
    }

    public single<T> (name: string): T {
        if (!this.instances.hasOwnProperty(name)) {
            this.instances[name] = this.make<T>(name);
        }
        return this.instances[name];
    }

    public overwrite<T> (name: string, service: (app: App) => T) {
        if (!this.services.hasOwnProperty(name)) {
            throw Error(AppExceptions.overwriteNotExist(name));
        }
        this.services[name] = service;
    }
}
