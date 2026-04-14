// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import styles from "./Stages.module.scss";

// const stagesData = [
//   { id: 1, num: "01", text: "Зарегистрируйтесь", img: "/icon-check.svg", btn: "Начать" },
//   { id: 2, num: "02", text: "Сделайте депозит", img: "/icon-coin.svg", btn: "Депозит" },
//   { id: 3, num: "03", text: "Получите фриспины", img: "/icon-apple.svg", btn: "Получить" },
//   { id: 4, num: "04", text: "Играйте и выигрывайте", img: "/icon-trophy.svg", btn: "Играть" },
//   { id: 5, num: "05", text: "Выводите денежные средства", img: "/icon-watch.svg", btn: "Вывести" },
// ];

// const Stages = () => {
//   const [activeId, setActiveId] = useState<number>(1);

//   return (
//     <section className={styles.wrapper}>
//       <h2 className={styles.title}>🤔 Как начать играть?</h2>

//       <div className={styles.grid}>
//         {stagesData.map((item) => (
//           <div
//             key={item.id}
//             className={`${styles.card} ${activeId === item.id ? styles.active : ""}`}
//             onClick={() => setActiveId(item.id)}
//           >
//             <span className={styles.number}>{item.num}</span>

//             <div className={styles.imgWrap}>
//               <Image src={item.img} alt={item.text} width={140} height={140} className={styles.img} />
//             </div>

//             <p className={styles.text}>{item.text}</p>

//             <Link href="/lobby" className={styles.btn}>
//               {item.btn}
//             </Link>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Stages;

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Stages.module.scss";
import { AppDispatch, RootState } from "@/shared/lib/redux/store";
import { registerUser } from "@/features/auth/model/authSlice";

// Убрали btn и Link из статических данных, логика будет динамичной
const stagesData = [
  { id: 1, num: "01", text: "Зарегистрируйтесь", img: "/icon-check.svg" },
  { id: 2, num: "02", text: "Сделайте депозит", img: "/icon-coin.svg" },
  { id: 3, num: "03", text: "Получите фриспины", img: "/icon-apple.svg" },
  { id: 4, num: "04", text: "Играйте и выигрывайте", img: "/icon-trophy.svg" },
  {
    id: 5,
    num: "05",
    text: "Выводите денежные средства",
    img: "/icon-watch.svg",
  },
];

const Stages = () => {
  const [activeId, setActiveId] = useState<number>(1);
  const [showRegForm, setShowRegForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    promo: "",
  });

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  // Обработчик кнопок для каждой стадии
  const handleStageAction = (id: number) => {
    switch (id) {
      case 1:
        if (!isAuthenticated) {
          setShowRegForm(true); // Показываем модалку/форму регистрации
        }
        break;
      case 2:
        if (!isAuthenticated) alert("Сначала зарегистрируйтесь!");
        else router.push("/deposit"); // Переход на страницу депозита
        break;
      case 3:
      case 4:
        router.push("/lobby"); // Переход в лобби
        break;
      case 5:
        if (!isAuthenticated) alert("Сначала авторизуйтесь!");
        else router.push("/withdraw"); // Переход к выводу
        break;
      default:
        break;
    }
  };

  // Отправка формы на ваш NestJS бэкенд
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      setShowRegForm(false);
      setActiveId(2); // Переводим юзера на следующий этап (Депозит)
      alert("Регистрация успешна! Кошельки созданы.");
    }
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>🤔 Как начать играть?</h2>

      <div className={styles.grid}>
        {stagesData.map((item) => (
          <div
            key={item.id}
            className={`${styles.card} ${activeId === item.id ? styles.active : ""}`}
            onClick={() => setActiveId(item.id)}
          >
            <span className={styles.number}>{item.num}</span>
            <div className={styles.imgWrap}>
              <Image
                src={item.img}
                alt={item.text}
                width={140}
                height={140}
                quality={100}
                sizes="(max-width: 1280px) 80px, 140px"
                className={styles.img}
              />
            </div>
            <p className={styles.text}>{item.text}</p>

            {/* Динамическая кнопка в зависимости от статуса авторизации */}
            <button
              className={styles.btn}
              onClick={() => handleStageAction(item.id)}
            >
              {item.id === 1 && isAuthenticated
                ? "Завершено"
                : item.id === 1
                  ? "Начать"
                  : item.id === 2
                    ? "Депозит"
                    : item.id === 3
                      ? "Получить"
                      : item.id === 4
                        ? "Играть"
                        : "Вывести"}
            </button>
          </div>
        ))}
      </div>

      {/* Простая форма регистрации (интегрирована с вашим бэкендом) */}
      {showRegForm && !isAuthenticated && (
        <div className={styles.modalOverlay}>
          <form className={styles.modalForm} onSubmit={handleRegisterSubmit}>
            <h3>Регистрация</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Пароль"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Промокод (необязательно)"
              value={formData.promo}
              onChange={(e) =>
                setFormData({ ...formData, promo: e.target.value })
              }
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Загрузка..." : "Зарегистрироваться"}
            </button>
            <button type="button" onClick={() => setShowRegForm(false)}>
              Закрыть
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default Stages;
