import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../src/api/v1/errors/errors";

describe("Authorization Middleware (AAA Format)", () => {
    let req: any;
    let res: any;
    let next: jest.Mock;

    beforeEach(() => {
        req = { params: {} };
        res = { locals: {} };
        next = jest.fn();
    });

    // 1. Returns 403 with ROLE_NOT_FOUND when user has no role
    it("returns 403 with ROLE_NOT_FOUND when user has no role", () => {
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

    // 2. Returns 403 with INSUFFICIENT_ROLE when role not in allowed list
    it("returns 403 with INSUFFICIENT_ROLE when role is not in allowed list", () => {
        // Arrange
        const middleware = isAuthorized({
            hasRole: ["admin"],
            allowSameUser: false
        });
        res.locals.role = "user"; // insufficient

        // Act
        middleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.any(AuthorizationError));
        const err = next.mock.calls[0][0];
        expect(err.code).toBe("INSUFFICIENT_ROLE");
        expect(err.message).toContain("Insufficient role");
    });

    // 3. Calls next() when user role is in allowed list
    it("calls next() when user role is in allowed list", () => {
        // Arrange
        const middleware = isAuthorized({
            hasRole: ["admin", "lead"],
            allowSameUser: false
        });
        res.locals.role = "lead";

        // Act
        middleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith();
    });

    // 4. Works with multiple allowed roles
    it("allows access when role matches one of multiple allowed roles", () => {
        // Arrange
        const middleware = isAuthorized({
            hasRole: ["admin", "lead", "developer"],
            allowSameUser: false
        });
        res.locals.role = "admin";

        // Act
        middleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith();
    });
});