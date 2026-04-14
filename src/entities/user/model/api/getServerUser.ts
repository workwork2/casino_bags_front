import { serverRequestWithAuth } from '@/shared/lib/api/server-api';

export async function getServerUser() {
	return serverRequestWithAuth('/auth/me');
}
