"use client";

import { useState } from "react";
import { isAddress, parseGwei } from "viem";
import type { Address, Hash } from "viem";
import { ConnectPublicClient, ConnectWalletClient, ensureSepolia, readableError } from "./client";

export default function TransactionComponent() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("3");
  const [hash, setHash] = useState<Hash | "">("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    setError("");
    setHash("");
    setStatus("");
    if (!isAddress(recipient)) {
      setError("Введите корректный Ethereum-адрес получателя.");
      return;
    }
    if (!/^\d+(\.\d+)?$/.test(amount) || Number(amount) <= 0) {
      setError("Введите положительное количество GWei (например, 3).");
      return;
    }
    setLoading(true);
    try {
      await ensureSepolia();
      const client = ConnectWalletClient();
      const [account] = await client.requestAddresses();
      if (!account) throw new Error("Сначала подключите MetaMask.");
      setStatus("Подтвердите транзакцию в MetaMask...");
      const transactionHash = await client.sendTransaction({
        account,
        to: recipient as Address,
        value: parseGwei(amount),
      });
      setHash(transactionHash);
      setStatus("Транзакция отправлена, ожидаем подтверждение Sepolia...");
      const receipt = await ConnectPublicClient().waitForTransactionReceipt({ hash: transactionHash });
      if (receipt.status === "success") {
        setStatus("Транзакция успешно подтверждена.");
      } else {
        setStatus("Транзакция была отклонена в блокчейне.");
      }
    } catch (e) {
      setError(readableError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" id="transaction">
      <h2>2. Отправка тестовой транзакции</h2>
      <p className="muted">Укажите адрес получателя и небольшой объём тестовых ETH в GWei. Например, 3 GWei = 0,000000003 ETH.</p>
      <label htmlFor="destination">Адрес получателя</label>
      <input id="destination" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="0x..." autoComplete="off" />
      <label htmlFor="gwei">Количество, GWei</label>
      <input id="gwei" value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" placeholder="3" />
      <button type="button" disabled={loading} onClick={send}>{loading ? "Выполняется..." : "Отправить тестовую транзакцию"}</button>
      {status && <p className="status" role="status">{status}</p>}
      {hash && <div className="result"><p>Хеш транзакции:</p><p className="mono">{hash}</p><a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noreferrer">Посмотреть транзакцию в Sepolia Etherscan</a></div>}
      {error && <p className="error" role="alert">{error}</p>}
    </section>
  );
}
