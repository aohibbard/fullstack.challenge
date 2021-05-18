import React, { ReactElement, useContext, useMemo, useState, useEffect } from 'react'
import { DateTime } from 'luxon'

import greeting from 'lib/greeting'

import Calendar from 'src/models/Calendar'
import Event from 'src/models/Event'
import AccountContext from 'src/context/accountContext'

import List from './List'
import EventCell from './EventCell'

import style from './style.scss'

type AgendaItem = {
  calendar: Calendar
  event: Event
}

const compareByDateTime = (a: AgendaItem, b: AgendaItem) =>
  a.event.date.diff(b.event.date).valueOf()

/**
 * Agenda component
 * Displays greeting (depending on time of day)
 * and list of calendar events
 */

const Agenda = (): ReactElement => {
  const account = useContext(AccountContext)

  //add departments and calendars to array with account, create filters based onthose.
  const events: AgendaItem[] = useMemo(
    () =>
      account.calendars
        .map(calendar =>
          calendar.events.map((event) => ({ calendar, event })),
        ).flat()
        .sort(compareByDateTime),
    [account],
  )

  //not optimal solution to update time
  useEffect(() => {
    const timer = setTimeout(() => 60000)
  }, [])

  const title = useMemo(() => greeting(DateTime.local().hour), [])

  //updating and selecting calendars
  const [visibleCalendars, selectCalendars] = useState([]))
  function filterCalendars(e:any){
    if (visibleCalendars.length === account.calendars.length){
      selectCalendars(visibleCalendars.filter(cal => cal === e.target.id))
    } else if (visibleCalendars.includes(e.target.id)){
      selectCalendars(visibleCalendars.filter(cal => cal !== e.target.id))
    } else {
      selectCalendars([...visibleCalendars, e.target.id])
    } 

    if (visibleCalendars.length === 0){
      selectCalendars(account.calendars.map(cal => cal.id))
    }
  }

  const [departments, selectDepartments] = useState([])
  const departmentList = Array.from(new Set(events.map(ev => {
    if(ev.event.department){
      ev.event.department
    }
  })))
  // function filterDepartments(e:any){
  //     reacte logic similar to above to update the array of selected departments
  //     filter the events useMemo function with this information
  // }


  return (
    <div className={style.outer}>
      <div className={style.container}>
        <div className={style.header}>
          <span className={style.title}>{title}</span>
        </div>

        <form>
          <p>Filter Calendars</p>
          { account.calendars.map( cal => (
            <label>
              <input type="checkbox" key={cal.id} id={cal.color} name={cal.color} onChange={(e) => filterCalendars(e)} />
              {cal.color}
            </label>
          ) }
        </form>
          // <p>Filter Departments</p>
          // { //departmentList.map(deptartmentName => {
          //     <label>
          //     <input type="checkbox" onChange={() => //filterDepartments()} />
          //     {deptartmentName}
          //   </label>
          //   })
          //}


        <List>
          {events.map(({ calendar, event }) => (
            <EventCell key={event.id} calendar={calendar} event={event} />
          ))}
        </List>
      </div>
    </div>
  )
}

export default Agenda
