import { Application } from "express";

import { AvailableDomains, AvailableUsers, UpdateUserDomain } from "../controllers/domains.js";

export const LoadDomainsEndpoint = async (app: Application): Promise<void> => {
	app.get("/api/v1/domains", AvailableDomains);

	app.get("/api/v1/domains/:domain/users", AvailableUsers)


	app.put("/api/v1/domains/:domain", UpdateUserDomain)

};
