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

/**
 * ==========================================
 * 查询 listings
 * 支持：
 * state
 * category_slug
 * make_slug
 * 分页：每页15条
 *
 * 不使用 RPC，直接 SELECT *
 * ==========================================
 */
export async function fetchListings({
                                        state = null,
                                        city = null,
                                        category = null,
                                        make = null,
                                        minPrice = null,
                                        maxPrice = null,
                                        page = 1,
                                        limit = 15
                                    } = {}) {

    try {

        const offset = (page - 1) * limit;

        let query = supabase
            .from('car_listings')
            .select('*', { count: 'exact' })
            .order('image_priority', { ascending: true })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // ===== 原有条件 =====
        if (state) query = query.eq('state', state);
        if (city) query = query.eq('city', city);
        if (category) query = query.eq('category', category);
        if (make) query = query.eq('make', make);

        // ===== 新增 price 区间 =====
        if (minPrice !== null) query = query.gte('price', minPrice);
        if (maxPrice !== null) query = query.lte('price', maxPrice);

        const { data, error, count } = await query;

        if (error) {
            console.error("Supabase error:", error);
            throw error;
        }

        // ⭐ 保持你的分页后排序逻辑
        const sorted = (data || []).sort((a, b) => {

            if (a.image_cover === '404.jpg' && b.image_cover !== '404.jpg')
                return 1;

            if (a.image_cover !== '404.jpg' && b.image_cover === '404.jpg')
                return -1;

            return 0;
        });

        const safeCount = count ?? 0;

        return {
            data: sorted,
            count: safeCount,
            page,
            totalPages: Math.ceil(safeCount / limit),
            error: null
        };

    } catch (err) {

        console.error('fetchListings 完整错误:', err);

        return {
            data: null,
            count: 0,
            totalPages: 0,
            error: err.message || err
        };
    }
}

/**
 * ==========================================
 * 根据 ID 获取 Listing 详情
 * SQL 等价:
 * SELECT * FROM car_listings WHERE id = ?;
 * ==========================================
 */
export async function fetchListingById(id) {

    try {

        if (!id) {
            throw new Error("ID is required");
        }

        const { data, error } = await supabase
            .from('car_listings')
            .select('*')
            .eq('id', id)
            .single(); // 只返回一条

        if (error) {
            throw new Error(error.message);
        }

        return {
            data,
            error: null
        };

    } catch (err) {

        console.error('fetchListingById 错误:', err);

        return {
            data: null,
            error: err.message
        };
    }
}

export async function fetchCitiesByState(state) {
    try {
        const { data, error } = await supabase.rpc('get_cities_by_state', {
            p_state: state   // ⚠️ 参数名必须和 postgres function 一致
        });

        if (error) {
            throw new Error(`获取 cities 时发生错误: ${error.message}`);
        }

        return { data, error: null };
    } catch (err) {
        console.error('fetchCitiesByState 错误:', err);
        return { data: null, error: err.message };
    }
}

export async function fetchMakesByState(state) {
    try {
        const { data, error } = await supabase.rpc('get_makes_by_state', {
            p_state: state   // ⚠️ 必须和 postgres 参数名一致
        });

        if (error) {
            throw new Error(`获取 makes 时发生错误: ${error.message}`);
        }

        return { data, error: null };
    } catch (err) {
        console.error('fetchMakesByState 错误:', err);
        return { data: null, error: err.message };
    }
}




