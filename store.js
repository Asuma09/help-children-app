import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

/**
 * ストレージ操作モジュール（Firebase対応）
 * Firebase Authentication と Cloud Firestore を使ってデータ管理する
 */
export const store = {
    /**
     * 新規ユーザーを登録する（親が行う）
     * @param {string} email
     * @param {string} password
     * @param {string} passphrase
     * @returns {Promise<string>} 家族ID（uid）
     */
    async registerUser(email, password, passphrase) {
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            const familyId = cred.user.uid;
            await setDoc(doc(db, "families", familyId), { passphrase, tasks: [] });
            return familyId;
        } catch (e) {
            if (e.code === "auth/email-already-in-use") {
                throw new Error("このメールアドレスはすでに登録されています");
            } else if (e.code === "auth/weak-password") {
                throw new Error("パスワードは6文字以上にしてくれ");
            }
            throw new Error("とうろくに しっぱいしたぞ");
        }
    },

    /**
     * ユーザー認証を行う（親子共通）
     * @param {string} email
     * @param {string} password
     * @param {string} passphrase
     * @returns {Promise<string>} 家族ID（uid）
     */
    async loginUser(email, password, passphrase) {
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            const familyId = cred.user.uid;

            const snap = await getDoc(doc(db, "families", familyId));
            if (!snap.exists() || snap.data().passphrase !== passphrase) {
                // auth.signOut(); // 必要ならログアウトさせる
                throw new Error("あいことばがちがうぞ");
            }
            return familyId;
        } catch (e) {
            if (e.message === "あいことばがちがうぞ") throw e;
            if (e.code === "auth/invalid-credential" || e.code === "auth/user-not-found" || e.code === "auth/wrong-password") {
                throw new Error("メールアドレスかパスワードが ちがうようだ");
            }
            throw new Error("ログインに しっぱいしたぞ");
        }
    },

    /**
     * タスク一覧を取得する
     * @param {string} familyId
     */
    async getTasks(familyId) {
        try {
            const snap = await getDoc(doc(db, "families", familyId));
            return snap.exists() ? (snap.data().tasks || []) : [];
        } catch { return []; }
    },

    /**
     * タスク一覧を保存する（上書き）
     * @param {string} familyId
     * @param {Array} tasks
     */
    async saveTasks(familyId, tasks) {
        await updateDoc(doc(db, "families", familyId), { tasks });
    },

    /**
     * 指定日の達成済みタスクID一覧を取得する
     * @param {string} familyId
     * @param {string} date (YYYY-MM-DD)
     */
    async getCompletions(familyId, date) {
        try {
            const snap = await getDoc(doc(db, "families", familyId, "completions", date));
            return snap.exists() ? (snap.data().taskIds || []) : [];
        } catch { return []; }
    },

    /**
     * タスクを達成済みとして記録する
     * @param {string} familyId
     * @param {string} taskId
     * @param {string} date
     */
    async addCompletion(familyId, taskId, date) {
        const ref = doc(db, "families", familyId, "completions", date);
        const cur = await store.getCompletions(familyId, date);
        if (!cur.includes(taskId)) {
            cur.push(taskId);
            await setDoc(ref, { taskIds: cur });
        }
    },

    /**
     * 指定日の達成記録をすべてリセットする
     * @param {string} familyId
     * @param {string} date
     */
    async resetCompletions(familyId, date) {
        try {
            await deleteDoc(doc(db, "families", familyId, "completions", date));
        } catch { }
    }
};
