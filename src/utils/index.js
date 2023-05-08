
export function getCurrentUser() {
    const currentUser = JSON.parse(sessionStorage.getItem('UserData'));
	return !!currentUser.role;
}

export function getAllowedRoutes(routes) {
	const roles = JSON.parse(localStorage.getItem('UserData'));
	// return routes.filter(({ permission }) => {
	// 	if(!permission) return true;
	// 	else if(!isArrayWithLength(permission)) return true;
	// 	else return intersection(permission, roles).length;
	// });
}
