<template>
  <div>
    <q-card class="mx-3 my-3" style="height: 750px">
      <q-splitter v-model="splitterModel">

        <template v-slot:before>
          <q-tabs
            v-model="tab"
            vertical
            class="text-teal"
          >
            <q-tab name="home" label="Accueil"/>
            <q-tab v-for="(todolist, i) in todoLists" :key="i" :name="'todoList-'+ todolist.id" :label="todolist.title"/>
            <q-tab name="add" label="Ajouter un todo" class="btn-add"/>
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="home" >
              <div class="text-h4 q-mb-md">Bienvenu sur vos todo liste</div>
              <p>lorem</p>
            </q-tab-panel>

            <q-tab-panel v-for="(todolist, i) in todoLists" :key="i" :name="'todoList-'+ todolist.id">
              <div class="text-h4 q-mb-md">{{ todolist.title }}</div>
              <p>{{ todolist.content }}</p>
              <q-btn push color="red" label="Supprimer" @click="delTodoList(todolist.id)"/>
            </q-tab-panel>

            <q-tab-panel name="add" >
              <form>
                <label>Titre : </label>
                <q-input outlined v-model="title" label="Label" type="text" />
                <label>Contenu : </label>
                <q-input outlined v-model="content" label="Label" type="text" />
                <button type="submit" @click="addTodoList">Enregistrer mon todo</button>
              </form>
            </q-tab-panel>

          </q-tab-panels>
        </template>

      </q-splitter>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { ref } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      todoLists: {},
      tab: ref('home'),
      splitterModel: ref(20),

      title: '',
      content: ''
    }
  },
  methods: {
    getTodoLists() {
      fetch('http://localhost:3000/todoLists', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        }}
      ).then((response) => {
        if (response.ok) {
          return response.json();
        }
      }).then((json) => {
        this.todoLists = json;
      });
    },
    async addTodoList() {
      if(this.title !== '' && this.content !== '') {
        const result = await fetch('http://localhost:3000/todoLists', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({title: this.title, content: this.content})}
        ).then((response) => {
          if (response.ok) {
            return response.json();
          }
        }).then((json) => { return json; });

        if(result.succes) {
          this.getTodoLists();
          this.tab = ref('todoList-'+ result.id);
          this.title = '';
          this.content = '';
        }
      }
    },
    async delTodoList(id) {
      const result = await fetch('http://localhost:3000/todoLists/'+ id, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
        }}
      ).then((response) => {
        if (response.ok) {
          return response.json();
        }
      }).then((json) => { return json; });

      if(result.succes) {
        this.getTodoLists();
        this.tab = ref('home');
        this.title = '';
        this.content = '';
      }
    }
  },
  mounted() {
    this.getTodoLists();
  }
})
</script>


<style scoped>
.btn-add {
  color: #21BA45;
  text-decoration: underline;
}
</style>
