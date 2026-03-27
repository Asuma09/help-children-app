/**
 * ストレージ操作モジュール
 * window.storage を使って家族データ・タスク・達成記録を永続化する
 */
export const store = {
    /**
     * あいことば（パスフレーズ）から家族IDを取得する
     * @param {string} passphrase - 家族のあいことば
     * @returns {Promise<string|null>} 家族ID、未登録の場合は null
     */
    async getFamilyId(passphrase) {
        const key = `fam:${passphrase}`;
        try {
            const r = await window.storage.get(key, true);
            return r ? r.value : null;
        } catch { return null; }
    },

    /**
     * 新しい家族を作成し、家族IDを返す
     * @param {string} passphrase - 家族のあいことば
     * @returns {Promise<string>} 生成された家族ID（UUID）
     */
    async createFamily(passphrase) {
        const id = crypto.randomUUID();
        const key = `fam:${passphrase}`;
        await window.storage.set(key, id, true);
        return id;
    },

    /**
     * 新規ユーザーを登録する（親が行う）
     * メールアドレス・パスワード・あいことばを保存し、家族IDを生成する
     * @param {string} email - メールアドレス
     * @param {string} password - パスワード
     * @param {string} passphrase - あいことば
     * @returns {Promise<string>} 生成された家族ID
     * @throws {Error} 既にメールアドレスが登録済みの場合
     */
    async registerUser(email, password, passphrase) {
        const key = `user:${email}`;
        const existing = await window.storage.get(key, true);
        if (existing) throw new Error("このメールアドレスはすでに登録されています");
        const familyId = await store.createFamily(passphrase);
        const userData = JSON.stringify({ password, passphrase, familyId });
        await window.storage.set(key, userData, true);
        return familyId;
    },

    /**
     * ユーザー認証を行う（親子共通）
     * メールアドレス・パスワード・あいことばが一致すれば家族IDを返す
     * @param {string} email - メールアドレス
     * @param {string} password - パスワード
     * @param {string} passphrase - あいことば
     * @returns {Promise<string>} 家族ID
     * @throws {Error} 認証失敗時
     */
    async loginUser(email, password, passphrase) {
        const key = `user:${email}`;
        const r = await window.storage.get(key, true);
        if (!r) throw new Error("メールアドレスがみつかりません");
        const data = JSON.parse(r.value);
        if (data.password !== password) throw new Error("パスワードがちがいます");
        if (data.passphrase !== passphrase) throw new Error("あいことばがちがいます");
        return data.familyId;
    },

    /**
     * 家族に登録されているタスク一覧を取得する
     * @param {string} familyId - 家族ID
     * @returns {Promise<Array>} タスクオブジェクトの配列
     */
    async getTasks(familyId) {
        try {
            const r = await window.storage.get(`tasks:${familyId}`, true);
            return r ? JSON.parse(r.value) : [];
        } catch { return []; }
    },

    /**
     * タスク一覧を保存する（上書き）
     * @param {string} familyId - 家族ID
     * @param {Array} tasks - タスクオブジェクトの配列
     */
    async saveTasks(familyId, tasks) {
        await window.storage.set(`tasks:${familyId}`, JSON.stringify(tasks), true);
    },

    /**
     * 指定日の達成済みタスクID一覧を取得する
     * @param {string} familyId - 家族ID
     * @param {string} date - 日付文字列（YYYY-MM-DD）
     * @returns {Promise<Array<string>>} 達成済みタスクIDの配列
     */
    async getCompletions(familyId, date) {
        try {
            const r = await window.storage.get(`done:${familyId}:${date}`, true);
            return r ? JSON.parse(r.value) : [];
        } catch { return []; }
    },

    /**
     * タスクを達成済みとして記録する（重複追加を防止）
     * @param {string} familyId - 家族ID
     * @param {string} taskId - タスクID
     * @param {string} date - 日付文字列（YYYY-MM-DD）
     */
    async addCompletion(familyId, taskId, date) {
        const cur = await store.getCompletions(familyId, date);
        if (!cur.includes(taskId)) {
            cur.push(taskId);
            await window.storage.set(`done:${familyId}:${date}`, JSON.stringify(cur), true);
        }
    },

    /**
     * 指定日の達成記録をすべてリセットする
     * @param {string} familyId - 家族ID
     * @param {string} date - 日付文字列（YYYY-MM-DD）
     */
    async resetCompletions(familyId, date) {
        try { await window.storage.delete(`done:${familyId}:${date}`, true); } catch { }
    },
};
