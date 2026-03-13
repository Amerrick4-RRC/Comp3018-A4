import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../src/api/v1/errors/errors";

describe("isAuthorized Middleware", () => {
    let req: any;
    let res: any;
    let next: jest.Mock;

    beforeEach(() => {
        req = { params: {} };
        res = { locals: {} };
        next = jest.fn();
    });

    // 1. allowSameUser: true AND uid === id → next()
    it("allows access when allowSameUser is true and uid matches id", () => {
        // Arrange
        const middleware = isAuthorized({
            hasRole: ["admin"],
            allowSameUser: true
        });
        req.params.id = "123";
        res.locals.uid = "123";

        // Act
        middleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith();
    });

    // 2. No role present → ROLE_NOT_FOUND
    it("returns ROLE_NOT_FOUND when no role exists on the user", () => {
        // Arrange
        const middleware = isAuthorized({
            hasRole: ["admin"],
            allowSameUser: false
        });
        res.locals.role = undefined;

        // Act
        middleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.any(AuthorizationError));
        const err = next.mock.calls[0][0];
        expect(err.code).toBe("ROLE_NOT_FOUND");
        expect(err.message).toContain("No role");
    });

    // 3. Role exists but is not in allowed list → INSUFFICIENT_ROLE
    it("returns INSUFFICIENT_ROLE when role is insufficient", () => {
        // Arrange
        const middleware = isAuthorized({
            hasRole: ["admin"],
            allowSameUser: false
        });
        res.locals.role = "user";

        // Act
        middleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.any(AuthorizationError));
        const err = next.mock.calls[0][0];
        expect(err.code).toBe("INSUFFICIENT_ROLE");
        expect(err.message).toContain("Insufficient role");
    });

    // 4. Role matches allowed roles → next()
    it("allows access when role is in allowed roles", () => {
        // Arrange
        const middleware = isAuthorized({
            hasRole: ["admin", "manager"],
            allowSameUser: false
        });
        res.locals.role = "manager";

        // Act
        middleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith();
    });

    // 5. allowSameUser is false AND uid === id → must check role instead
    it("does NOT allow same user when allowSameUser is false", () => {
        // Arrange
        const middleware = isAuthorized({
            hasRole: ["admin"],
            allowSameUser: false
        });
        req.params.id = "123";
        res.locals.uid = "123";
        res.locals.role = "user";

        // Act
        middleware(req, res, next);

        // Assert
        const err = next.mock.calls[0][0];
        expect(err.code).toBe("INSUFFICIENT_ROLE");
    });
});