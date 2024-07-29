# Mineral CLI Usage Guide

[Downloads](https://github.com/ronanyeah/mineral-app/releases)

#### Linux
```bash
./mineral-linux help
export WALLET=suiprivkey11111111111111111111111111111111
./mineral-linux mine
```

#### MacOS
```bash
./mineral-macos help
export WALLET=suiprivkey11111111111111111111111111111111
./mineral-macos mine
```

#### Windows (PowerShell)
```
.\mineral-win.exe help
$env:WALLET = "suiprivkey11111111111111111111111111111111"
.\mineral-win.exe mine
```

#### Windows (CMD)
```
.\mineral-win.exe help
set WALLET=suiprivkey11111111111111111111111111111111
.\mineral-win.exe mine
```

---

#### Custom RPC

Use the `RPC` enviroment variable to set a custom RPC endpoint:

```bash
export RPC="https://sui-mainnet.blockvision.org:443/v1/12345"
```