import 'core-js/stable'
import 'regenerator-runtime/runtime'
// import `.scss` files
import './scss/styles.scss'

// import UserList class
import { Galerie as defaultExport } from './lib/galery'

// export default UserList class
// I used `defaultExport` to state that variable name doesn't matter
export default defaultExport
