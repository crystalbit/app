const winners = new Set([
  '0x68E0a859F6CeEdA38E4F76F79C1AbaA2653c0d32',
  '0xE1D8c2312c1df45f970F008960F93a45737A7561',
  '0x3E5e94Cbe622B263b0274DF442F80992324c028b',
  '0xC18261759d8D9d9e32c001ff437D159Ac19f8a2C',
  '0x172b5A54c850048B04f0A3250f23a7C98b1f909B',
  '0x982DA5F09Aa4faC242634aCE73054e5797C320eF',
  '0x4b216134a315a6c73213171258d7eaA7f768b495',
  '0x02D2BbF8B2525C55Bd97928D089f98F3077D212b',
  '0x9e2D3e87901947c10bb24049fad0cd7e0829fDBB',
  '0x90559626fBd2fD09E10FB66B297C5541dE432968',
  '0x28582eb6585116b30f45fC08Cdb9dA7f8Be5dc69',
  '0xD575444d0cFFd10A289509e3Ed93AeE804C0aca3',
  '0x158f8e0CA216c55b955024ffD30A4fc88702F17c',
  '0x59e7a5FD042c01c1adB747207350D51004EacA09',
  '0x077501A4da76a0E190273d3b46549eF7Dd454b3c',
  '0x1C515165FA78Ca1E196073669528171375f69AaF',
  '0xF12b21DB477A5c7be78cFF23c3e7d3e2E5ba2Ab2',
  '0x1a3933c1BB0BcE13A7b65788C366B19D9348807B',
  '0x5AFE1E34a0537De5c6A2600F98e832B20e722C33',
  '0x311ddb1e4B2218a12991283650F831034Ed1E00F',
  '0x4614517Ff8F37502dAf2f42767B711a93a76aE49',
  '0xA62C6665365aEEa7884f4C83f7583319C0354D76',
  '0x9ec03537e521285f1f0282f04cea23900b69d42b',
  '0xF94238aD6E9Dc37348B5Df8901bf57920A0b9b0f',
  '0x7262A11473123815fc254f54FE21c993284A05C6',
  '0xe110121CdDC2a46EEEA4526Bf76Bea01e4603191',
  '0x6BaF1509471D81Bd8c83638058b1DCc01aa80607',
  '0xd114a5F747655A5A49B2dEa7EDda923eff109C5D',
  '0x1bcE5683b2da46D5Deedb55B8317Bc4AA3C5DEEd',
  '0x8E6b56ca2Ef39cCa96048a4E7AC5Db9e8F5A7C23',
  '0x7E6ccF78aFEae14da775d51491100d3d81356464',
  '0xBfA58c2516cB64C7f6E19c0B3690158C38E4d0f7',
  '0xfD9e30Fa47FDfDe0713637F2f22b9409Cc944520',
  '0x882742Ed1100121D4A7CdFaFf2acF6f4119fA0c2',
  '0x4e9A024d53D7E7d4E64a5d958F8F72Eb2857d334',
  '0x02dDd85EbF98903b514807cDD079209a01431B28',
  '0x8C53C41ecbE42A8bcd8466e041499f98ed7DF0fC',
  '0x31e0f232745DC1a5cDbc318E6a16068F5a44ae42',
  '0x756d4EA31f79D8F07814284683Db6Cf03A65eD5C',
  '0x7eA3fC962C2e0Ee15d85EF3C30f4caf0aED834ba',
  '0x242809413e20470c63D12913Cb4eAA2412e89877',
  '0xb48e0a49A42b219D766E4d3F1A3b20E5E237B682',
  '0xE2FF2760c202bf46FED0fED5453A8493992E969C',
  '0xfD43e4a26949C2161F2cCe8116e4792bc76FF66a',
  '0x974FbbEe45ba09ADa72404dd41ff27B2B90B11c8',
  '0x781775ec6d08bD56f2C67D1EBCaEC498FDeAa268',
  '0x2A8F405b1c54Ec3e3a841C75444d2aA9D9876403',
  '0x275E4D3E3959cD48411Ff85B8d334cD7d3E387c8',
  '0x4c1BF8aFbD183B1ce7daa530b60c9A145d3cad72',
  '0x4Fe67d306b4DAaC0D5915D8EDEBC461e4206190F',
  '0x00b74aab194e4563e13ea17F97861Bd61D29E207',
  '0x98e304fa7a2Ef5bF283B634b5202621Ad1323fbf',
  '0x4ab14d4a01943137f761862bb27fC132a5BAb62B',
  '0xb4105B3248CEFA335F8359Bea41c2b756AD7B15B',
  '0x10A3739Ed4963AEdd3Fd26b4440cfa01F0262553',
  '0xC5369141C587E2a40bd71751fC02A4CB2729C153',
  '0xf0218C34Ea9aFfDf2B7c3b38B196c9b31d61804b',
  '0x957C18cfABa0d149a1822915B4F92AF8009e5a6D',
  '0xAdA5c5F6124D26746dd424ff9AA6068439685295',
  '0x2A47376Dab03cc10F146642406Eb79322506e95C',
  '0x37541eC1223a8E9b1e6CBA5238E7b028170AbE15',
  '0x7A5EBFFbC4a6cB142E4dC57A0db7662766fA0b14',
  '0x2a23Ee4D575499ec9AC58dCfD3960C5D3f1F0d3B',
  '0xB7ecaDEb3207407B143f8a0F98fa13bc92c9F8b8',
  '0x541A9FFe0a907767c5e889C54ecb0ea350651688',
  '0x5783a0cd262ccdabAAA5F823fc7EC41257087b88',
  '0x1908b86F1B14c70eC36379182f6D05924085d363',
  '0xd5347a8aCe534f0e4c87630B0796905c0BF05Fc1',
  '0x34f66771F71317e5B73010e86e64F0F0495F4C7D',
  '0x90387C19BAa6293730905869fE693C8d1cDf77bb',
  '0xCc911E986e9d6Cd53fF7611F24e64399224B09be',
  '0x9C4b3231C37974c79d58337A4Cd663d6fBc07A6e',
  '0x87D72d48327d3F212346ecA6E9fBC4Db427cB93D',
  '0xcb12632A0b0C51C67fc77Ca1E2ef6890bDB92266',
  '0xAA9e12EDD2Ac7cD6E0B5cbdf310aaBF5280F5E6D',
  '0xD31d9F0C458B89ffb8AA97a311441853093a578e',
  '0x6D02393Dd7dF925b9B5a4493216ACCB1226692ac',
  '0x7F1624E1BF82DD81578F43259911c3c184A003eF',
  '0xF11fa95356870AAB982f4Da9C1561801A284e5E0',
  '0xEb6BC16f50b848B7BE341784Cbd472D5a8249E4c',
  '0x578Bb89A95B85385D537eDCbE3F5A54876f0Cf6f',
  '0x7C422b3d77E9972778Cd3C310834DF87cbad5965',
  '0x0cC4baE3ACb07aa241b946be3753D9A8e427c8BA',
  '0x9ADb91D703a13998d76DBb18b4eEE2967fF7f7B3',
  '0xc03C81d8A78d6Da7527ff7F5a430C8EAfb6145fA',
  '0x71cba9937aECD2Fb226341295723A3E2425e39a8',
  '0x03364F74ee34Ef895a65960Ca475f94B645bA01E',
  '0x36A5A2D58730A9F6591377956E5D6E5a590e72D6',
  '0x69Af844b93a22c22a7125e72E554dB951741a8a0',
  '0xEaB7Fa4aE7a6C61A1C37c26fdD03F7e6Ae6AE31F',
  '0xdf427B2aa315E5E9991F249d1664675Ea7EBb9Ac',
  '0xAB78A012a52943354C3935b8dA4b7EB3858776bB',
  '0x7285e37dE8C04c977da83d5085046692a2b5107b',
  '0xE2c2E919A35e1c012f5FfCC77574C9037dD9521b',
  '0x8F57D589e06D295Ea766ec19ACDd7Df38fbf11F2',
  '0xF14Fcf5E52Cf8C26a6E78f633775F7e7fB098E2C',
  '0xC31e1dE5AE0C43b9218070E535E777F00AC1778C',
  '0xd314eFfF3927fed28f55A7c6545B94fB92edfc2f',
  '0x6Fc05190d320156708d937F8E3DC44AFA0E263F0',
  '0x5B6a34D75aD2Fdaef426ffC6590a1D8b411a257D'
  // '0x04077e97b8169e8A603eb21a009De45c68F58ccB',
]);

export const isWinner = (address0x: string): boolean | null => {
  if (!address0x) {
    return null;
  }
  return winners.has(address0x.trim());
};