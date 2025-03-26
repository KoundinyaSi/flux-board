"use client"

import { useState, useCallback, useEffect } from "react"

export function useUndoRedo(initialState) {
  const [past, setPast] = useState([])
  const [future, setFuture] = useState([])
  const [current, setCurrent] = useState(initialState)

  // Update current state when initialState changes, but only for significant changes
  useEffect(() => {
    // Compare if the state has actually changed in a meaningful way
    const currentNodesIds =
      current?.nodes
        ?.map((n) => n.id)
        .sort()
        .join(",") || ""
    const newNodesIds =
      initialState?.nodes
        ?.map((n) => n.id)
        .sort()
        .join(",") || ""

    const currentEdgesIds =
      current?.edges
        ?.map((e) => e.id)
        .sort()
        .join(",") || ""
    const newEdgesIds =
      initialState?.edges
        ?.map((e) => e.id)
        .sort()
        .join(",") || ""

    if (currentNodesIds !== newNodesIds || currentEdgesIds !== newEdgesIds) {
      setCurrent(initialState)
    }
  }, [initialState, current])

  const saveState = useCallback(
    (newState) => {
      setPast((prev) => [...prev, current])
      setCurrent(newState)
      setFuture([])
    },
    [current],
  )

  const undo = useCallback(() => {
    if (past.length === 0) return

    const previous = past[past.length - 1]
    const newPast = past.slice(0, past.length - 1)

    setPast(newPast)
    setCurrent(previous)
    setFuture([current, ...future])
  }, [past, current, future])

  const redo = useCallback(() => {
    if (future.length === 0) return

    const next = future[0]
    const newFuture = future.slice(1)

    setPast([...past, current])
    setCurrent(next)
    setFuture(newFuture)
  }, [past, current, future])

  return {
    past,
    future,
    current,
    undo,
    redo,
    saveState,
  }
}

