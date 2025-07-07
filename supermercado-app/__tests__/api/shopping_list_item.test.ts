// __tests__/api/shopping_list_item.test.ts
import { NextResponse } from "next/server";
import { GET } from "../../app/api/shopping_list_item/route";


describe("app /api/shopping_list_item", () => {
  it("deve ser verdadeiro o básico", () => {
    expect(true).toBe(true);
  });
    it("GET deve retornar status 200", async () => {
        const response = await GET();
        expect(response.status).toBe(200);
    });
    it("GET deve retornar um array de itens da lista de compras", async () => {
        const response = await GET();
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0); // Verifica se há pelo menos um item
    });
    it("GET deve retornar um array de itens com as propriedades corretas", async () => {
        const response = await GET();
        const data = await response.json();
        data.forEach((item: ShoppingListItemWithRelations) => {
            expect(item).toHaveProperty("id");
            expect(item).toHaveProperty("shoppingListId");
            expect(item).toHaveProperty("productId");
            expect(item).toHaveProperty("quantity");
            expect(item).toHaveProperty("collected");
            expect(item).toHaveProperty("shoppingList");
            expect(item).toHaveProperty("product");
        });

        interface ShoppingList {
            id: number;
            name: string;
        }

        interface Product {
            id: number;
            name: string;
            price: number;
        }

        interface ShoppingListItemWithRelations {
            id: number;
            shoppingListId: number;
            productId: number;
            quantity: number;
            purchased: boolean;
            shoppingList: ShoppingList;
            product: Product;
        }
    });
    it("GET deve retornar um array de itens com as propriedades corretas nos objetos alinhados", async () => {
        const response = await GET();
        const data = await response.json();
        data.forEach((item: ShoppingListItemWithRelations) => {
            expect(item.shoppingList).toHaveProperty("id");
            expect(item.shoppingList).toHaveProperty("name");
            expect(item.product).toHaveProperty("id");
            expect(item.product).toHaveProperty("name");
            expect(item.product).toHaveProperty("price");
        });

    interface ShoppingList {
        id: number;
        name: string;
    }

    interface Product {
        id: number;
        name: string;
        price: number;
    }

    interface ShoppingListItemWithRelations {
        id: number;
        shoppingListId: number;
        productId: number;
        quantity: number;
        purchased: boolean;
        shoppingList: ShoppingList;
        product: Product;
    }
    });
    it("GET deve retornar um array de itens com quantidade maior que zero", async () => {
        const response = await GET();
        const data = await response.json();
        data.forEach((item: ShoppingListItemWithRelations) => {
            expect(item.quantity).toBeGreaterThan(0);
        });

        interface ShoppingList {
            id: number;
            name: string;
        }

        interface Product {
            id: number;
            name: string;
            price: number;
        }

        interface ShoppingListItemWithRelations {
            id: number;
            shoppingListId: number;
            productId: number;
            quantity: number;
            purchased: boolean;
            shoppingList: ShoppingList;
            product: Product;
        }
    });
});

// __tests__/api/shopping_list_item.test.ts


describe("GET app/api/shopping_list_item", () => {
  it("retorna status 200", async () => {
    const response = await GET(); // ou passar um objeto mockado se necessário
    expect(response.status).toBe(200);
  });
    it("retorna um array de itens da lista de compras", async () => {
        const response = await GET();
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0); // Verifica se há pelo menos um item
    });
    
});

   // return NextResponse.json({ message: "Item deletado com sucesso" });

// POST - Criar novo item na lista de compras
//export async function POST(req: Request) {
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
