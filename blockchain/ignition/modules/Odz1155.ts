import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Odz1155Module = buildModule("OdzModule", (m) => {
  const odz1155 = m.contract('Odz1155', []);
  const odz20 = m.contract('Odz20', []);

  m.call(odz1155, 'setOdzCoin', [odz20]);
  m.call(odz20, 'grantMinterRole', [odz1155]);

  return { odz1155, odz20 };
});

export default Odz1155Module;
