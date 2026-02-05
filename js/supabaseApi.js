import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm';

/**
 * Supabase 初始化
 */
const supabase = createClient(
    'https://iyrrjbbhpfxzrtowfvmo.supabase.co',
    'sb_publishable_Q_kt0UKC0MkpyyYu56fmdg_e6Ge-sVr'
);

/**
 * ===============================
 * RPC：获取所有 States
 * SQL: select * from get_all_states();
 * ===============================
 */
export async function fetchAllStates() {
    try {
        const { data, error } = await supabase.rpc('get_all_states');

        if (error) {
            throw new Error(`获取 states 时发生错误: ${error.message}`);
        }

        return { data, error: null };
    } catch (err) {
        console.error('fetchAllStates 错误:', err);
        return { data: null, error: err.message };
    }
}

/**
 * ==========================================
 * RPC：根据 State 获取 Categories
 * SQL: SELECT * FROM get_categories_by_state('District of Columbia');
 * 参数名假设为: state_name
 * ==========================================
 */
export async function fetchCategoriesByState(stateName) {
    try {
        const { data, error } = await supabase.rpc(
            'get_categories_by_state',
            { p_state: stateName } // <-- 改成实际参数名
        );

        if (error) throw new Error(error.message);

        return { data, error: null };
    } catch (err) {
        console.error('fetchCategoriesByState 错误:', err);
        return { data: null, error: err.message };
    }
}

/**
 * ==========================================
 * RPC：根据 Category 获取 States
 * SQL: SELECT * FROM get_states_by_category('SUVs');
 * 参数名假设为: category_name
 * ==========================================
 */
export async function fetchStatesByCategory(categoryName) {
    try {
        const { data, error } = await supabase.rpc(
            'get_states_by_category',
            { p_category: categoryName }  // <--- 这里改成 p_category
        );

        if (error) {
            throw new Error(`根据 category 获取 states 时发生错误: ${error.message}`);
        }

        return { data, error: null };
    } catch (err) {
        console.error('fetchStatesByCategory 错误:', err);
        return { data: null, error: err.message };
    }
}


/**
 * ==========================================
 * RPC：获取所有 Categories + 数量统计
 * SQL: SELECT * FROM get_all_categories_with_count();
 * ==========================================
 */
export async function fetchAllCategoriesWithCount() {
    try {
        const { data, error } = await supabase.rpc(
            'get_all_categories_with_count'
        );

        if (error) {
            throw new Error(`获取 categories 统计时发生错误: ${error.message}`);
        }

        return { data, error: null };
    } catch (err) {
        console.error('fetchAllCategoriesWithCount 错误:', err);
        return { data: null, error: err.message };
    }
}

/**
 * ==========================================
 * RPC：根据 State 获取 Popular Makes
 * SQL: SELECT * FROM get_popular_makes_by_state('Alabama');
 * 参数名: p_state
 * ==========================================
 */
export async function fetchPopularMakesByState(stateName) {
    try {
        const { data, error } = await supabase.rpc(
            'get_popular_makes_by_state',
            { p_state: stateName }
        );

        if (error) {
            throw new Error(
                `根据 state 获取 popular makes 时发生错误: ${error.message}`
            );
        }

        return { data, error: null };

    } catch (err) {

        console.error('fetchPopularMakesByState 错误:', err);

        return {
            data: null,
            error: err.message
        };
    }
}

