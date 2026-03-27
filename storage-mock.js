/**
 * window.storage のローカル開発用モック
 * 本番環境ではプラットフォームが window.storage を提供するため、
 * このモックは window.storage が存在しない場合のみ有効になる
 * データは localStorage に保存される
 */
if (!window.storage) {
    const PREFIX = "__storage_mock__:";
    window.storage = {
        /**
         * キーに対応する値を取得する
         * @param {string} key - ストレージキー
         * @returns {Promise<{value: string}|null>} 値が存在すれば {value} オブジェクト、なければ null
         */
        async get(key) {
            const v = localStorage.getItem(PREFIX + key);
            return v !== null ? { value: v } : null;
        },

        /**
         * キーに値を保存する
         * @param {string} key - ストレージキー
         * @param {string} value - 保存する値
         */
        async set(key, value) {
            localStorage.setItem(PREFIX + key, value);
        },

        /**
         * キーに対応する値を削除する
         * @param {string} key - ストレージキー
         */
        async delete(key) {
            localStorage.removeItem(PREFIX + key);
        },
    };
}
