import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>(
            "role",
            context.getHandler(),
        );

        if (!requiredRoles) {
            return true; // No role specified, allow access
        }

        const request = context.switchToHttp().getRequest();
        console.log("request.user: "+context.switchToHttp().getRequest().user);
        const user = request.user; // Ensure the user object is properly defined

        if (!user || !user.role) {
            return false; // User or role property is missing, deny access
        }

        const userRoles = Array.isArray(user.role) ? user.role : [user.role];
        const hasRequiredRole = userRoles.some((role) =>
            requiredRoles.includes(role),
        );

        return hasRequiredRole;
    }
}
