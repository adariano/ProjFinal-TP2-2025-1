// __tests__/api/shopping_list_item.test.ts
import { prisma } from "@/lib/prisma";
import { GET } from "../../app/api/shopping_list_item/route";


describe("app /api/shopping_list_item", () => {
  it("deve ser verdadeiro o básico", () => {
    expect(true).toBe(true);
  });
});

// __tests__/api/shopping_list_item.test.ts


describe("GET app/api/shopping_list_item", () => {
  it("retorna status 200", async () => {
    const response = await GET(); // ou passar um objeto mockado se necessário
    expect(response.status).toBe(200);
  });
});

//   return NextResponse.json({ message: "Item deletado com sucesso" });
//   } catch (error) {
//     return NextResponse.json({ error: "Erro ao deletar item" }, { status: 500 });
//   }
// }
// }
//
// // POST - Criar novo item na lista de compras
// export async function POST(req: Request) {
// Código comentado/ignorado pois 'req' não está definido neste contexto de teste
// try {
//   const body = await req.json();

//   // Validação básica
//   if (!body.shoppingListId || !body.productId || body.quantity == null) {
//     return NextResponse.json(
//       { error: "Lista de compras, produto e quantidade são obrigatórios" },
//       { status: 400 }
//     );
//   }

//   const newItem = await prisma.shoppingListItem.create({
//     data: {
//       shoppingListId: body.shoppingListId,
//       productId: body.productId,
//       quantity: body.quantity,
//     },
//     include: { shoppingList: true, product: true },
//   });

//   return NextResponse.json(newItem);
// } catch (error) {
//   return NextResponse.json(
//     { error: "Erro ao criar item na lista de compras" },
//     { status: 500 }
//   );
// }
//   }
//

// // DELETE - Deletar item da lista de compras
// export async function DELETE(req: Request) {
//   try {
//     const body = await req.json();
//     const { id } = body;
//   } catch (error) {
//     return NextResponse.json({ error: "Erro ao deletar item" }, { status: 500 });
//   }
// }
// }
//
// // POST - Criar novo item na lista de compras
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { shoppingListId, productId, quantity } = body;
//
//     if (!shoppingListId || !productId || quantity == null) {
//       return NextResponse.json(
//         { error: "Lista de compras, produto e quantidade são obrigatórios" },
//         { status: 400 }
//       );
//     }
//
//     const newItem = await prisma.shoppingListItem.create({
//       data: {
//         shoppingListId,
//         productId,
//         quantity,
//       },
//       include: { shoppingList: true, product: true },
//     });
//
//     return NextResponse.json(newItem);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Erro ao criar item na lista de compras" },
//       { status: 500 }
//     );
//   }
// }
//   if (!id) {
//     return NextResponse.json({ error: "ID do item é obrigatório" }, { status: 400 });
//   }
//
//   try {
//     await prisma.shoppingListItem.delete({
//       where: { id },
//     });
//     return NextResponse.json({ message: "Item deletado com sucesso" });
//   } catch (error) {
//     return NextResponse.json({ error: "Erro ao deletar item" }, { status: 500 });
//   }
// }
// }
