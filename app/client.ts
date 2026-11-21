import { createWalletClient, createPublicClient, custom } from "viem";
import type { EIP1193Provider } from "viem";
import { sepolia } from "viem/chains";

// Работа с браузерным провайдером: этот код вызывается только после нажатия кнопки.
export function getWalletProvider(): EIP1193Provider {
  if (typeof window === "undefined") {
    throw new Error("Операция доступна только в браузере.");
  }
  const provider = (window as Window & { ethereum?: EIP1193Provider }).ethereum;
  if (!provider) {
    throw new Error("Кошелёк не найден. Установите и разблокируйте MetaMask.");
  }
  return provider;
}

export function ConnectPublicClient() {
  // Считываем данные через установленный Web3-провайдер MetaMask.
  return createPublicClient({ chain: sepolia, transport: custom(getWalletProvider()) });
}

export function ConnectWalletClient() {
  return createWalletClient({ chain: sepolia, transport: custom(getWalletProvider()) });
}

export async function ensureSepolia(): Promise<void> {
  const currentChain = await getWalletProvider().request({ method: "eth_chainId" });
  if (currentChain !== "0xaa36a7") {
    throw new Error("Выберите в MetaMask тестовую сеть Sepolia (chain ID 11155111).");
  }
}

export async function switchToSepolia(): Promise<void> {
  await getWalletProvider().request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0xaa36a7" }],
  });
}

export function readableError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("User rejected") || error.message.includes("rejected the request")) {
      return "Пользователь отклонил запрос в MetaMask.";
    }
    return error.message.length > 240 ? error.message.slice(0, 240) + "…" : error.message;
  }
  return "Неизвестная ошибка.";
}
