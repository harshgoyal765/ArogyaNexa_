import { staticApi } from '@/lib/api/static';
import { mockStaticService } from '@/mock/services/static.mock';
import { USE_MOCK_DATA, logServiceMode } from '@/lib/config';

logServiceMode('StaticService', USE_MOCK_DATA);

export const staticService = USE_MOCK_DATA ? mockStaticService : staticApi;
