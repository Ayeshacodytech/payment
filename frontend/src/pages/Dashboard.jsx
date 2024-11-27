import { Appbar } from "../Componenets/AppBar"
import { Balance } from "../Componenets/Balance"
import { Users } from "../Componenets/User"
export const Dashboard = ()=>{

    return <div>
        <Appbar/>
        <div className="m-8">
            <Balance/>
            <Users/>
        </div>
    </div>
}