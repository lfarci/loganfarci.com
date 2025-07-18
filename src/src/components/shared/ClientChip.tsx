"use client";

import { Chip, ChipProps } from "@heroui/react";
import React from "react";

export default function ClientChip(props: ChipProps) {
    return <Chip {...props}>{props.children}</Chip>;
}
