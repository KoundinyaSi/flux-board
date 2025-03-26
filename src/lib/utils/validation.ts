import * as z from "zod"

export function getNodeSchema(nodeType: string) {
  switch (nodeType) {
    case "task":
      return z.object({
        name: z.string().min(1, "Task name is required"),
        assignee: z.string().optional(),
        dueDate: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["pending", "inProgress", "completed", "cancelled"]),
      })
    case "condition":
      return z.object({
        name: z.string().min(1, "Condition name is required"),
        condition: z.string().optional(),
        description: z.string().optional(),
      })
    case "notification":
      return z.object({
        name: z.string().min(1, "Notification name is required"),
        recipients: z.string().optional(),
        message: z.string().optional(),
        channel: z.enum(["email", "sms", "push", "slack"]),
      })
    default:
      return z.object({
        name: z.string().min(1, "Name is required"),
      })
  }
}

