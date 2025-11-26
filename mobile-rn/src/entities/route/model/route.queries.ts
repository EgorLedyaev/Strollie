import { useMutation } from '@tanstack/react-query';

import { buildOptimalRoute } from '@/shared/api';

export const useBuildRouteMutation = () =>
	useMutation({
		mutationFn: buildOptimalRoute,
	});
