<script setup>
import queryField from '../components/queryField.vue'
</script>

<template>
  <main style="display: flex; flex-grow:1;">
    <div style="flex-grow:1; display: flex; flex-direction: column;">
      <div style="
        background-color: #444;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        <queryField/>
      </div>
      <div style="
        background-color: #333;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      ">
        <div>
          Basemap
        </div>
      </div>
    </div>
    <div style="
      width: 600px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    ">
      <div>
        Document results
      </div>
    </div>
  </main>
</template>
