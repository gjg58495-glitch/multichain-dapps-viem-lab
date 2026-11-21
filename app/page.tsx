import WalletComponent from "./walletComponent";
import TransactionComponent from "./transactionComponent";
import TokenComponent from "./tokenComponent";
import ExtraContractComponent from "./extraContractComponent";

export default function Home() {
  return (
    <main className="container">
      <header className="header">
        <div className="eyebrow">Лабораторная работа · Технологии распределённого реестра</div>
        <h1>Multichain dApps</h1>
        <p>Next.js + viem + MetaMask. Подключение кошелька, тестовый перевод и чтение смарт-контрактов Sepolia.</p>
        <div className="chip">Тестовая сеть: Sepolia · ID 11155111</div>
      </header>
      <div className="banner">Работайте только с тестовыми средствами. Не вводите секретную фразу и не используйте кошелёк с раскрытыми ранее ключами.</div>
      <WalletComponent />
      <TransactionComponent />
      <TokenComponent />
      <ExtraContractComponent />
      <footer>Учебное приложение. Чтение контрактов не требует комиссии; отправка транзакции требует тестовый ETH.</footer>
    </main>
  );
}
