import { registerHandbookCredit, upgradeMountPoints } from "./credit";

registerHandbookCredit();

function boot(): void {
  upgradeMountPoints();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

export { registerHandbookCredit, upgradeMountPoints };
