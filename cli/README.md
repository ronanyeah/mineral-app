# Mineral CLI Usage Guide

[Downloads](https://github.com/ronanyeah/mineral-app/releases)

#### Linux
```
./mineral-linux help
export WALLET=suiprivkey11111111111111111111111111111111
./mineral-linux mine
```

#### MacOS
```
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

__NOTE:__ In addition to `WALLET`, the `RPC` environment variable can be used to override the default `https://fullnode.mainnet.sui.io:443`.