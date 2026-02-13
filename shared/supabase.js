// Supabase Configuration
// Project: Khangtsen
const SUPABASE_URL = 'https://axnongwefdafwflekysk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pFwy1o_CK9ps98dK-yDyTQ_zXaCU2_y';

// Initialize Supabase client
const supabase = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Storage helpers
const STORAGE = {
    photos: {
        bucket: 'photos',
        getPublicUrl: (path) => `${SUPABASE_URL}/storage/v1/object/public/photos/${path}`,
    },
    documents: {
        bucket: 'documents',
    },
};
