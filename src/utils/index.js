
export function getCurrentUser() {
    const currentUser = JSON.parse(sessionStorage.getItem('UserData'));
	return !!currentUser.role;
}

export function getAllowedRoutes(routes) {
	const roles = JSON.parse(localStorage.getItem('UserData'));
	
}
