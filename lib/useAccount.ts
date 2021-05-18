import { useState } from 'react'

import Account from 'src/models/Account'
import createAccount from 'lib/createAccount'

import getUpdatedAccount from './getUpdatedAccount'

const initialAccountValue = createAccount()

const useAccount = (): [Account, () => Promise<void>] => {
  const [account, setAccount] = useState<Account>(initialAccountValue)
  //not working but something like this
  const refreshAccount = async () => {
    try {
      setAccount(await getUpdatedAccount(account))
      if(account === initialAccountValue){
        alert("The account failed to update");
      }
    }
    //catch (error) {
    //   alert(error)
    // }
  }
  return [account, refreshAccount]
}

export default useAccount
